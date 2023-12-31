import { Thing } from 'abstract-things';

const thing = new Thing(); // $ExpectType Thing

thing.init(); // $ExpectType Promise<Thing | undefined>
thing.initCallback(); // $ExpectType Promise<void>
thing.destroy(); // $ExpectType Promise<void>
thing.destroyCallback(); // $ExpectType Promise<void>

thing.emitEvent('', ''); // $ExpectType void
thing.emitEvent('', '', { multiple: true }); // $ExpectType void
thing.emitEvent('', '', {}); // $ExpectError
thing.emitEvent('', '', { multiple: '' }); // $ExpectError
thing.emitEvent(''); // $ExpectType void
thing.emitEvent(); // $ExpectError

thing.on(''); // $ExpectError
const stoppable = thing.on('', () => {}); // $ExpectType Stoppable
stoppable.stop(); // $ExpectType void

thing.off(''); // $ExpectError
thing.off('', () => {}); // $ExpectType void

thing.onAny(() => {}); // $ExpectType Stoppable
thing.onAny(); // $ExpectError

thing.offAny(() => {}); // $ExpectType void
thing.offAny(); // $ExpectError

thing.debug(); // $ExpectType void

thing.matches(''); // $ExpectType boolean
thing.matches('', ''); // $ExpectType boolean
thing.matches(1); // $ExpectError
thing.matches(); // $ExpectType boolean

const func: (i: number) => string = i => i.toString();
Thing.type(func); // $ExpectType ((i: number) => string) & Thing
Thing.mixin(func); // $ExpectType ((i: number) => string) & Thing
thing.extendWith(func); // $ExpectType ((i: number) => string) & Thing
