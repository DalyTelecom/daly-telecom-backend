import { LightAbonentList } from '../light-abonentlist';
import { FlatLightAbonent } from './flat-light-abonent';

export type TFlatLightAbonentList = Readonly<[
   abonents: ReadonlyArray<FlatLightAbonent>,
   total: number,
   pageNumber: number,
   pageSize: number,
   totalPages: number,
]>;

declare const SECRET_SYMBOL: unique symbol;

const FlatLightAbonentListConstructor: new (
   abonents: ReadonlyArray<FlatLightAbonent>,
   total: number,
   pageNumber: number,
   pageSize: number,
   totalPages: number,
) => TFlatLightAbonentList = Array as any;

export class FlatLightAbonentList extends FlatLightAbonentListConstructor {
   // @ts-ignore
   private readonly [SECRET_SYMBOL]: unknown;

   constructor(list: LightAbonentList) {
      const flatList = list.abonents.map((a) => new FlatLightAbonent(a));
      super(flatList, list.total, list.pageNumber, list.pageSize, list.totalPages);
   }
}
