import React from 'react';
import { render, mount } from 'enzyme';
import Passport from '..';

const Inner = () => (<div>inner</div>);
const NotPass = () => (<div>notpass</div>);

describe('Passport', () => {
  it('should through the check without any props', () => {
    const content = render(
      <Passport>
        <Inner/>
      </Passport>
    );
    expect(content.text()).toBe('inner');
  });

  it('should render nothing when not pass', () => {
    const content = render(
      <Passport
        condition={false}
      >
        <Inner/>
      </Passport>
    );
    expect(content.html()).toBeNull();
  });

  it('should render not pass content when not pass', () => {
    const content = render(
      <Passport
        condition={false}
        notPassContent={<NotPass/>}
      >
        <Inner/>
      </Passport>
    );
    expect(content.text()).toBe('notpass');
  });

  it('should render correct when use role verifiy and only specific role can pass', () => {
    const content1 = render(
      <Passport
        role="role1"
        allowRole="role2"
      >
        <Inner/>
      </Passport>
    );
    expect(content1.html()).toBeNull();
    const content2 = render(
      <Passport
        role="role1"
        allowRole="role1"
      >
        <Inner/>
      </Passport>
    );
    expect(content2.text()).toBe('inner');
  });

  it('should render correct when use role verifiy and minimum role can pass', () => {
    const content1 = render(
      <Passport
        role="role1"
        allRoles={['role0', 'role1', 'role2', 'role3']}
        allowMinRole="role2"
      >
        <Inner/>
      </Passport>
    );
    expect(content1.html()).toBeNull();
    const content2 = render(
      <Passport
        role="role2"
        allRoles={['role0', 'role1', 'role2', 'role3']}
        allowMinRole="role1"
      >
        <Inner/>
      </Passport>
    );
    expect(content2.text()).toBe('inner');
    const content3 = render(
      <Passport
        role="role3"
        allRoles={{
          "role3": 3,
          "role1": 1,
          "role4": 4,
          "role0": 0,
          "role2": 2,
        }}
        allowMinRole="role2"
      >
        <Inner/>
      </Passport>
    );
    expect(content3.text()).toBe('inner');
  });

  it(`should 'onAuthCheck' can recieve custom props and other safety props`, () => {
    const config = {
      mode: '&',
      k: '1010010101000001'
    };
    const onAuthCheck = (p) => {
      if (p.k === config.k && p.mode === config.mode) {
        return true;
      }
      return false;
    }
    const content = render(
      <Passport
        {...config}
        onAuthCheck={onAuthCheck}
      >
        <Inner/>
      </Passport>
    );
    expect(content.text()).toBe('inner');
  });

  it(`should render correct when use auth check`, () => {
    const content1 = render(
      <Passport
        onAuthCheck={() => {
          return false;
        }}
      >
        <Inner/>
      </Passport>
    );
    expect(content1.html()).toBeNull();
    const content2 = render(
      <Passport
        onAuthCheck={() => {
          return true;
        }}
      >
        <Inner/>
      </Passport>
    );
    expect(content2.text()).toBe('inner');
  });

  it(`should 'mode' prop worked correct`, () => {
    const content1 = render(
      <Passport
        mode='|'
        condition={false}
        onAuthCheck={() => {
          return true;
        }}
      >
        <Inner/>
      </Passport>
    );
    expect(content1.text()).toBe('inner');
    const content2 = render(
      <Passport
        mode='&'
        condition={false}
        onAuthCheck={() => {
          return true;
        }}
      >
        <Inner/>
      </Passport>
    );
    expect(content2.html()).toBeNull();
  });
});