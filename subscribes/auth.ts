import authEvents from '../api/resources/auth/events';
import eventEmitter from './eventEmitter';

eventEmitter.on(authEvents.signup, () => {
  console.log('Hello new user')
});

