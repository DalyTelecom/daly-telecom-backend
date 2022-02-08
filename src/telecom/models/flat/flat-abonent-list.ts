import { AbonentList } from '../abonentlist.response';
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

   constructor(list: AbonentList) {
      const flatList = list.abonents.map((a) => new FlatAbonent(a));
      super(flatList, list.total, list.pageNumber, list.pageSize);
   }
}
