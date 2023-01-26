import { assertType, expectTypeOf } from 'vitest'
import {
    getTokenAddress,
    getP2PixAddress,
    getProviderUrl,
    isPossibleNetwork,
    possibleChains,
    network2Chain,
} from '../addresses'

test("My addresses.ts types work properly", () =>{

    expectTypeOf(getTokenAddress).toBeFunction()
    expectTypeOf(getP2PixAddress).toBeFunction()
    expectTypeOf(getProviderUrl).toBeFunction()
    expectTypeOf(isPossibleNetwork).toBeFunction()

    expectTypeOf(possibleChains).toBeObject()
    expectTypeOf(network2Chain).toBeObject()

})