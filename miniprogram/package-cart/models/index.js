import create from './cart/create';
import list, { all } from './cart/list';
import deleteMany from './cart/delete';
import get from './cart/get';
import update, { updateMany } from './cart/update';

export default {
  create,
  get,
  list,
  all,
  deleteMany,
  update,
  updateMany,
};
