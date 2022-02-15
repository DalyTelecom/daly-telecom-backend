import { LightAbonent } from '../light-abonent';

export type TFlatLightAbonent = Readonly<[
   id: number,
   name: string | '',
   address: string | '',
   phone: string | '',
]>;

declare const SECRET_SYMBOL: unique symbol;

const FlatLightAbonentConstructor: new (
   id: number,
   name: string | '',
   address: string | '',
   phone: string | '',
) => TFlatLightAbonent = Array as any;

export class FlatLightAbonent extends FlatLightAbonentConstructor {
   // @ts-ignore
   private readonly [SECRET_SYMBOL]: unknown;

   constructor(a: LightAbonent) {
      super(
         a.id,
         a.name ?? '',
         a.address ?? '',
         a.phone ?? '',
      );
   }
}
