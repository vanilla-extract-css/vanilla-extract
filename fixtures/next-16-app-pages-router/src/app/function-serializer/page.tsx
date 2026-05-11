import { RedBox, BlueText } from './source.css';

export default function Page() {
  return (
    <div>
      <h1>Function Serializer Test</h1>
      <RedBox>
        This should be a red box with <BlueText>blue text</BlueText> inside
      </RedBox>
    </div>
  );
}
