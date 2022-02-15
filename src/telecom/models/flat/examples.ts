import { ApiResponseOptions } from '@nestjs/swagger';
import { FlatAbonent, FlatAbonentList, FlatLightAbonentList } from './index';
import { AbonentEntity } from '../abonent.entity';

const DummyAbonent: AbonentEntity = {
   id: 42,
   name: 'name',
   address: 'address',
   phone: 'phone',
   mobile: 'mobile',
   kross: 1,
   magistral: 1,
   raspred: 1,
   adsl: 1,
   boxes: ['boxes'],
   latitude: 37.586452,
   longitude: 54.166907,
};

const FlatAbonentExample = new FlatAbonent(DummyAbonent);

export const FlatAbonentResponseSchema: ApiResponseOptions = {schema: {example: FlatAbonentExample}};

const FlatAbonentListExample = new FlatAbonentList({abonents: [DummyAbonent, DummyAbonent], total: 7, totalPages: 4, pageSize: 2, pageNumber: 1});

export const FlatAbonentListResponseSchema: ApiResponseOptions = {schema: {example: FlatAbonentListExample}};

export const FlatLightAbonentListExample = new FlatLightAbonentList({abonents: [DummyAbonent, DummyAbonent], total: 7, totalPages: 4, pageSize: 2, pageNumber: 1});
