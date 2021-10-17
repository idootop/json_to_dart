import test from '../../assets/favicon.svg';
import { LColumn, LExpaned, LImage, LInput, LPage, LText, LView } from '../../common/components';
import { log } from '../../common/services';

export const Home = () => {
  return (
    <LPage>
      <LColumn mainSize="max">
        <LView color="pink" padding={20} size={300} align="topLeft">
          <LText>Hello world!</LText>
        </LView>
        <LInput
          onChange={(s) => {
            log.d(s);
          }}
          color="grey"
          boder="10 dashed rgba(255,0,255,60%)"
          padding={10}
          hintStyle={{
            color: 'red',
            weight: 'bold',
          }}
        />
        <LExpaned align="center" onClick={() => console.log('>>> onTap LExpaned')}>
          <LImage
            src={test}
            size={100}
            height={500}
            color="red"
            fit="scale-down"
            radius={50}
            onClick={() => console.log('>>> onTap LImage')}
          />
        </LExpaned>
      </LColumn>
    </LPage>
  );
};
