import { ListrTaskWrapper } from 'listr2';
import { Context } from '..';

export const title = 'some title here';

// TODO @jose: Come up with a type for this function and put it in the `types` folder
export default async function eslintCheck(
  ctx: Context,
  task: ListrTaskWrapper<any, any>
) {
  if (/* something crazy */ true) {
    task.skip('whaaaat skipping.....');
  }
}
