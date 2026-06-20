import { CreateProductDto } from './createProduct.dto';

export interface UpdateProductDto extends Partial<CreateProductDto> {}
