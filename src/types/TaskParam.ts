import { ListrTaskWrapper } from 'listr2';
import { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';

export type TaskParam = ListrTaskWrapper<any, typeof DefaultRenderer>;
