import { CreateCustomerDto } from './createCustomer.dto';

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}
