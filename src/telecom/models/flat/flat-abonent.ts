import { AbonentEntity } from '../abonent.entity';

export type TFlatAbonent = Readonly<[
   id: number,
   name: string | '',
   address: string | '',
   phone: string | '',
   mobile: string | '',
   kross: number | '',
   magistral: number | '',
   raspred: number | '',
   adsl: number | '',
   boxes: ReadonlyArray<string>,
   latitude: number | '',
   longitude: number | '',
]>;

declare const SECRET_SYMBOL: unique symbol;

const FlatAbonentConstructor: new (
   id: number,
   name: string | '',
   address: string | '',
   phone: string | '',
   mobile: string | '',
   kross: number | '',
   magistral: number | '',
   raspred: number | '',
   adsl: number | '',
   boxes: ReadonlyArray<string>,
   latitude: number | '',
   longitude: number | '',
) => TFlatAbonent = Array as any;

export class FlatAbonent extends FlatAbonentConstructor {
   // @ts-ignore
   private readonly [SECRET_SYMBOL]: unknown;

   constructor(a: AbonentEntity) {
      super(
         a.id,
         a.name ?? '',
         a.address ?? '',
         a.phone ?? '',
         a.mobile ?? '',
         a.kross ?? '',
         a.magistral ?? '',
         a.raspred ?? '',
         a.adsl ?? '',
         a.boxes,
         a.latitude ?? '',
         a.longitude ?? '',
      );
   }
}
