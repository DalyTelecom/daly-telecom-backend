import { AbonentEntity } from '../abonent.entity';
import { FlatAbonent } from './flat-abonent';

export type TFlatAbonentList = Readonly<[
   abonents: ReadonlyArray<FlatAbonent>,
   total: number,
   pageNumber: number,
   pageSize: number,
]>;

declare const SECRET_SYMBOL: unique symbol;

const FlatAbonentListConstructor: new (
   abonents: ReadonlyArray<FlatAbonent>,
   total: number,
   pageNumber: number,
   pageSize: number,
) => TFlatAbonentList = Array as any;

export class FlatAbonentList extends FlatAbonentListConstructor {
   // @ts-ignore
   private readonly [SECRET_SYMBOL]: unknown;

   constructor(list: AbonentEntity[], total: number, pageNumber: number, pageSize: number) {
      const flatList = list.map((a) => new FlatAbonent(a));
      super(flatList, total, pageNumber, pageSize);
   }
}
