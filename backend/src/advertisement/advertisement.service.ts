import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhereProperty,
  ILike,
  Repository,
  Not,
  In,
  Any,
} from 'typeorm';

import { AdvertisementEntity } from './advertisement.entity';
import { TypeRole } from 'src/auth/auth.interface';
import { CategoryService } from 'src/category/category.service';
import {
  advertisementSearchDto,
  advertisementUpdateDto,
} from './dto/advertisement.dto';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectRepository(AdvertisementEntity)
    private readonly advertisementRepository: Repository<AdvertisementEntity>,
    private readonly categoryService: CategoryService,
  ) {}
  private readonly availableRoles: TypeRole[] = ['admin', 'moderator'];

  async byId(adId: number, isPublic: boolean = false, userId?: number) {
    const advertisement = await this.advertisementRepository.findOne({
      where: isPublic
        ? {
            id: adId,
            isApprove: true,
            isPrivate: false,
            user: {
              advertisements: {
                id: Not(adId),
                isPrivate: false,
                isApprove: true,
              },
            },
          }
        : {
            id: adId,
            user: {
              advertisements: {
                id: Not(adId),
              },
            },
          },
      relations: {
        user: {
          advertisements: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
          advertisements: true,
          phone: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!advertisement) throw new NotFoundException('Advertisement not found!');

    if (userId) {
      if (
        advertisement.user?.id !== userId &&
        !this.availableRoles.includes(advertisement.user?.role)
      ) {
        throw new BadRequestException('This advertisement is not available');
      }
    }

    return advertisement;
  }

  async getAll(data: advertisementSearchDto, isPrivate: boolean = true) {
    const { searchTerm, categoryId } = data;
    const categoryIdNum = Number(categoryId);
    let options: FindOptionsWhereProperty<AdvertisementEntity> = {};
    let allId: number[] = [];

    if (searchTerm) {
      options = {
        ...options,
        title: ILike(`%${searchTerm}%`),
      };
    }

    if (categoryId) {
      if (isNaN(categoryIdNum))
        throw new BadRequestException('The Category ID must be a number.');

      allId = await this.categoryService.getSubcategories(categoryIdNum);

      options = {
        ...options,
        category: {
          id: Any([categoryIdNum, ...allId]),
        },
      };
    }

    if (isPrivate) {
      options = {
        ...options,
        isPrivate: false,
        isApprove: true,
      };
    }

    const ads = await this.advertisementRepository.find({
      where: {
        ...options,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
        },
      },
    });

    return ads;
  }

  async create(userId: number) {
    const defaultValues = {
      title: '',
      description: '',
      price: 0,
      videoPath: '',
      user: { id: userId },
    };

    const newAdvertisement = this.advertisementRepository.create(defaultValues);
    const advertisement = await this.advertisementRepository.save(
      newAdvertisement,
    );

    return advertisement;
  }

  async update(adsId: number, dto: advertisementUpdateDto, userId: number) {
    const advertisement = await this.byId(adsId, false, userId);

    if (dto.category) {
      await this.categoryService.checkCategoryExist('id', dto.category);
    }

    if (
      typeof dto.isApprove === 'boolean' &&
      !this.availableRoles.includes(advertisement.user?.role)
    ) {
      throw new BadRequestException("You don't have enough rights");
    }

    const data = { ...dto, category: { id: dto.category } };

    return this.advertisementRepository.save({
      ...advertisement,
      ...data,
    });
  }

  async delete(id: number, userId: number) {
    const advertisement = await this.advertisementRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

    if (!advertisement) {
      throw new NotFoundException('Advertisement not found!');
    }

    if (advertisement.user?.id !== userId) {
      throw new BadRequestException(
        "You can't delete another user's advertisement!",
      );
    }

    return this.advertisementRepository.delete({ id });
  }
}
