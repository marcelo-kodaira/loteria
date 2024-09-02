import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable, NotFoundException, BadRequestException, HttpStatus, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ClientSession, Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './product.model';
import Ajv, { JSONSchemaType } from 'ajv';

export class CustomHttpException extends HttpException {
  constructor(message: string, status: HttpStatus, code?: string) {
    super({ message, code, timestamp: new Date().toISOString() }, status);
  }
}


@Injectable()
export class AjvValidationPipe implements PipeTransform {
  private ajv = new Ajv();

  constructor(private schema: JSONSchemaType<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const validate = this.ajv.compile(this.schema);
    const valid = validate(value);
    if (!valid) {
      throw new BadRequestException('Validation failed', validate.errors);
    }
    return value;
  }
}

const ajv = new Ajv();

const createProductSchema: JSONSchemaType<CreateProductDto> = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string', nullable: true },
    price: { type: 'number', minimum: 0 },
    category: { type: 'string', minLength: 1 },
  },
  required: ['title', 'price'],
  additionalProperties: false,
};

const validateCreateProduct = ajv.compile(createProductSchema);

import {  NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AjvValidationInterceptor implements NestInterceptor {
  constructor(private readonly validator: (data: any) => boolean) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    if (!this.validator(request.body)) {
      throw new BadRequestException('Validation failed: ' + this.formatAjvErrors(this.validator.errors));
    }

    return next.handle();
  }

  private formatAjvErrors(errors: any): string {
    return errors.map((err: any) => `${err.instancePath} ${err.message}`).join(', ');
  }
}

import { Controller, Post, UseInterceptors } from '@nestjs/common';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(new AjvValidationInterceptor(validateCreateProduct))
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<string> {
    return this.productService.createProduct(createProductDto);
  }
}


@Injectable()
export class ProductRepository {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

  async startSession(): Promise<ClientSession> {
    return this.productModel.db.startSession();
  }

  async createProduct(productData: Partial<Product>, session: ClientSession): Promise<Product> {
    const newProduct = new this.productModel(productData);
    return newProduct.save({ session });
  }

  async findProductById(id: string, session?: ClientSession): Promise<Product | null> {
    return this.productModel.findById(id).session(session).exec();
  }

  async updateProduct(product: Product, session: ClientSession): Promise<Product> {
    return product.save({ session });
  }

  async deleteProductById(id: string, session: ClientSession): Promise<number> {
    const result = await this.productModel.deleteOne({ _id: id }, { session }).exec();
    return result.deletedCount;
  }

  async findAll(filters?: any): Promise<Product[]> {
    const query = this.productModel.find();
    const { category, minPrice, maxPrice } = filters || {};

    if (category) {
      query.where('category').equals(category);
    }

    if (minPrice !== undefined) {
      query.where('price').gte(minPrice);
    }

    if (maxPrice !== undefined) {
      query.where('price').lte(maxPrice);
    }

    return query.select('title description price category').exec();
  }
}

@Injectable()
export class ProductAssembler {
  fromCreateDto(createProductDto: CreateProductDto): Partial<Product> {
    return {
      title: createProductDto.title,
      description: createProductDto.description,
      price: createProductDto.price,
      category: createProductDto.category,
    };
  }

  fromUpdateDto(updateProductDto: UpdateProductDto, existingProduct: Product): Product {
    existingProduct.title = updateProductDto.title || existingProduct.title;
    existingProduct.description = updateProductDto.description || existingProduct.description;
    existingProduct.price = updateProductDto.price || existingProduct.price;
    existingProduct.category = updateProductDto.category || existingProduct.category;
    return existingProduct;
  }
}

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productAssembler: ProductAssembler
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<string> {
    const session: ClientSession = await this.productRepository.startSession();
    session.startTransaction();

    try {
      const newProductData = this.productAssembler.fromCreateDto(createProductDto);
      const newProduct = await this.productRepository.createProduct(newProductData, session);
      await session.commitTransaction();
      return newProduct.id as string;
    } catch (error) {
      await session.abortTransaction();
      throw new CustomHttpException('Failed to create product', HttpStatus.BAD_REQUEST, 'PRODUCT_CREATION_ERROR');
    } finally {
      session.endSession();
    }
  }

  async getProducts(filters?: any): Promise<Product[]> {
    const products = await this.productRepository.findAll(filters);
    if (products.length === 0) {
      throw new CustomHttpException('No products found with the given criteria', HttpStatus.NOT_FOUND, 'PRODUCTS_NOT_FOUND');
    }
    return products;
  }

  async getProduct(productId: string): Promise<Product> {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new CustomHttpException('Could not find product', HttpStatus.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }
    return product;
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto): Promise<void> {
    const session: ClientSession = await this.productRepository.startSession();
    session.startTransaction();

    try {
      const product = await this.productRepository.findProductById(productId, session);
      if (!product) {
        throw new CustomHttpException('Could not find product', HttpStatus.NOT_FOUND, 'PRODUCT_NOT_FOUND');
      }

      const updatedProduct = this.productAssembler.fromUpdateDto(updateProductDto, product);
      await this.productRepository.updateProduct(updatedProduct, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new CustomHttpException('Failed to update product', HttpStatus.BAD_REQUEST, 'PRODUCT_UPDATE_ERROR');
    } finally {
      session.endSession();
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const session: ClientSession = await this.productRepository.startSession();
    session.startTransaction();

    try {
      const deletedCount = await this.productRepository.deleteProductById(productId, session);
      if (deletedCount === 0) {
        throw new CustomHttpException('Could not find product', HttpStatus.NOT_FOUND, 'PRODUCT_NOT_FOUND');
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new CustomHttpException('Failed to delete product', HttpStatus.BAD_REQUEST, 'PRODUCT_DELETION_ERROR');
    } finally {
      session.endSession();
    }
  }
}

