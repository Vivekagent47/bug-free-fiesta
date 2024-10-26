import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Tag } from './entity/Tags.entity';
import { TagsDto } from './tags.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getHello() {
    return 'Hello World!';
  }

  private validateTagData(tag: Tag | TagsDto) {
    if (tag.data && tag.children?.length) {
      throw new BadRequestException(
        `Tag "${tag.name}" cannot have both data and children`,
      );
    }
  }

  async getFullTree(): Promise<Tag[]> {
    const tagsRepo = this.entityManager.getTreeRepository(Tag);
    const tags = await tagsRepo.findTrees();
    return tags;
  }

  async getTagById(id: number): Promise<Tag | null> {
    const tagsRepo = this.entityManager.getTreeRepository(Tag);
    const tag = await this.entityManager.findOne(Tag, { where: { id } });
    if (!tag) {
      throw new BadRequestException(`Tag with id ${id} not found`);
    }
    return tagsRepo.findDescendantsTree(tag);
  }

  async syncTags(tagDto: TagsDto): Promise<Tag> {
    if (!tagDto) {
      throw new BadRequestException('Tag data is required');
    }

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        // If ID is provided, verify the tag exists
        let existingTree = null;
        if (tagDto.id) {
          existingTree = await this.entityManager.findOne(Tag, {
            where: { id: tagDto.id },
            relations: ['children'],
          });

          if (!existingTree) {
            throw new BadRequestException(`Tag with id ${tagDto.id} not found`);
          }
        }

        return this.syncTagsRecursive(
          tagDto,
          null,
          existingTree,
          transactionalEntityManager,
        );
      },
    );
  }

  private validateTagStructure(tagDto: TagsDto) {
    // Validate current tag
    this.validateTagData(tagDto);

    // Recursively validate children
    if (tagDto.children?.length) {
      tagDto.children.forEach((child) => {
        this.validateTagStructure(child);
      });
    }
  }

  private async syncTagsRecursive(
    newTag: TagsDto,
    parentId: number | null,
    existingTag: Tag | null,
    transactionalEntityManager: EntityManager,
  ): Promise<Tag> {
    try {
      // Validate the tag data before processing
      this.validateTagData(newTag);

      // Create or update the current tag
      const tag = existingTag || new Tag();
      tag.name = newTag.name;
      tag.data = newTag.data;

      if (parentId) {
        const parent = await transactionalEntityManager.findOne(Tag, {
          where: { id: parentId },
        });
        if (parent) {
          tag.parent = parent;
        }
      }

      const savedTag = await transactionalEntityManager.save(Tag, tag);

      // Get existing children IDs for comparison
      const existingChildren = existingTag?.children || [];
      // const existingChildrenIds = new Set(
      //   existingChildren.map((child) => child.id),
      // );
      const newChildrenIds = new Set(
        newTag.children?.map((child) => child.id) || [],
      );

      // Find children to delete
      const childrenToDelete = existingChildren.filter(
        (child) => !newChildrenIds.has(child.id),
      );

      if (childrenToDelete.length) {
        await transactionalEntityManager.remove(childrenToDelete);
      }

      // Process new/updated children
      if (newTag.children?.length) {
        const processedChildren = await Promise.all(
          newTag.children.map((childDto) => {
            const existingChild = existingChildren.find(
              (child) => child.id === childDto.id,
            );
            return this.syncTagsRecursive(
              childDto,
              savedTag.id,
              existingChild,
              transactionalEntityManager,
            );
          }),
        );
        savedTag.children = processedChildren;
      }

      return savedTag;
    } catch (error) {
      // Convert generic errors to BadRequestException with context
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Error processing tag "${newTag.name}": ${error.message}`,
      );
    }
  }
}
