import { Box } from '../system';
import { MdxBlock } from '../MdxBlock';
import { CompiledCode, type CompiledCodeProps } from './CompiledCode';

export default (props: CompiledCodeProps) => (
  <MdxBlock maxWidth="xlarge">
    <Box paddingY="large">
      <CompiledCode {...props} />
    </Box>
  </MdxBlock>
);
