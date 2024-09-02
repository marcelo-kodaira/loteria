import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './user.model';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { User } from '@core/user/domain/user.aggregate';
import { UserModelMapper } from './user-mapper';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  async create(user: User): Promise<void> {
    const userData = UserModelMapper.toModel(user);
    const newUser = new this.userModel(userData);
    await newUser.save();
  }

  async bulkCreate(users: User[]): Promise<void> {
    const usersData = users.map(UserModelMapper.toModel);
    await this.userModel.insertMany(usersData);
  }

  async update(user: User): Promise<void> {
    const userData = UserModelMapper.toModel(user);
    const updatedUser = await this.userModel
      .findByIdAndUpdate(user.userId.id, userData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundError(user.userId.id, User);
    }
  }

  async delete(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) {
      throw new NotFoundError(userId, User);
    }
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundError(userId, User);
    }
    return UserModelMapper.toEntity(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map(UserModelMapper.toEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? UserModelMapper.toEntity(user) : null;
  }

  async search(searchParams: any): Promise<{ items: User[]; total: number }> {
    const { filter, sort, sortDir, page, perPage } = searchParams;
    const query: any = {};

    if (filter) {
      query['name'] = { $regex: new RegExp(filter, 'i') };
    }

    const sortOptions: any = {};
    if (sort && sortDir) {
      sortOptions[sort] = sortDir === 'asc' ? 1 : -1;
    }

    const users = await this.userModel
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    const count = await this.userModel.countDocuments(query).exec();

    return {
      items: users.map(UserModelMapper.toEntity),
      total: count,
    };
  }
}
