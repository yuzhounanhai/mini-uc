import * as React from 'react';
import cn from 'classnames';
import { cnPrefix } from '@/config/variable';
import { addClass, removeClass, hasClass } from '@/utils/dom';
import KeyCode from '@/utils/KeyCode';
import Fade from '@/components/Animation/Fade';
import './styles';

export interface ListDataItem {
  key: string,
  value: string,
  disabled?: boolean,
  [key: string]: any,
}

export interface SelectMenuProps {
  listData: ListDataItem[],
  initialSelectedKey: string,
  placeholder?: string,
  tabIndex?: number,
  menuClassName?: string,
  style?: React.CSSProperties,
  onSelect?: (selectedKey: string, selectObj: ListDataItem) => void,
  onBeforeSelected?: (selectedKey: string, selectObj: ListDataItem) => boolean|undefined|null,
  onSelected?: (selectedKey: string, selectObj: ListDataItem) => void,
};

interface SelectMenuState {
  selectedKey: string,
  isOpenList: boolean,
}

class SelectMenu extends React.Component<SelectMenuProps, SelectMenuState> {
  static defaultProps = {
    listData: [],
    initialSelectedKey: '',
    placeholder: '',
    tabIndex: -1,
  }

  listData: ListDataItem[] = [];

  listMap: { [key: string]: ListDataItem } = {};

  keyMap: string[] = [];

  menuRef: HTMLDivElement;

  constructor(props: SelectMenuProps) {
    super(props);
    // 构建 map
    this.props.listData.forEach((item: ListDataItem) => {
      if (item.key === '') {
        throw Error('Can not set a empty key value.');
      } else {
        if (this.listMap.hasOwnProperty(item.key)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Key value is repeat. The previous data will be overwritten.');
          }
          this.listData.filter(i => {
            return item.key === i.key;
          });
        } else {
          this.keyMap.push(item.key);
        }
        this.listData.push(item);
        this.listMap[item.key] = item;
      }
    });
    let selectedKey = '';
    // 处理 selectedKey
    if (this.props.initialSelectedKey) {
      // 如果 selectedKey 不在listData中，则予以警告并使用空值。
      if (this.keyMap.indexOf(this.props.initialSelectedKey) > -1) {
        selectedKey = this.props.initialSelectedKey;
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('InitialSelectedKey can not found in listData.');
        }
      }
    }
    this.state = {
      selectedKey,
      isOpenList: false,
    }
    this.onClickWrap = this.onClickWrap.bind(this);
    this.getMenuNode = this.getMenuNode.bind(this);
    this.onBlurMenu = this.onBlurMenu.bind(this);
    this.onKeyDownMenu = this.onKeyDownMenu.bind(this);
  }

  onKeyDownMenu(e: React.KeyboardEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const { isOpenList } = this.state;
    if (isOpenList) {
      if (e.keyCode === KeyCode.DOWN) {
        const $focusCollection = this.menuRef.getElementsByClassName(`${cnPrefix}-select-menu-menu-item-focus`);
        if ($focusCollection.length) {
          let $nextNode = $focusCollection[0].nextElementSibling;
          while ($nextNode && hasClass($nextNode, `${cnPrefix}-select-menu-menu-item-disabled`)) {
            $nextNode = $nextNode.nextElementSibling;
          }
          if ($nextNode) {
            removeClass($focusCollection[0], `${cnPrefix}-select-menu-menu-item-focus`);
            addClass($nextNode, `${cnPrefix}-select-menu-menu-item-focus`);
          }
        } else {
          const $menuItemCollection = this.menuRef.getElementsByClassName(`${cnPrefix}-select-menu-menu-item`);
          if ($menuItemCollection.length) {
            let $selectNode: Element|null = $menuItemCollection[0];
            while($selectNode && hasClass($selectNode, `${cnPrefix}-select-menu-menu-item-disabled`)) {
              $selectNode = $selectNode.nextElementSibling;
            }
            if ($selectNode) {
              addClass($selectNode, `${cnPrefix}-select-menu-menu-item-focus`);
            }
          }
        }
      } else if (e.keyCode === KeyCode.UP) {
        const $focusCollection = this.menuRef.getElementsByClassName(`${cnPrefix}-select-menu-menu-item-focus`);
        if ($focusCollection.length) {
          let $nextNode = $focusCollection[0].previousElementSibling;
          while ($nextNode && hasClass($nextNode, `${cnPrefix}-select-menu-menu-item-disabled`)) {
            $nextNode = $nextNode.previousElementSibling;
          }
          if ($nextNode) {
            removeClass($focusCollection[0], `${cnPrefix}-select-menu-menu-item-focus`);
            addClass($nextNode, `${cnPrefix}-select-menu-menu-item-focus`);
          }
        } else {
          const $menuItemCollection = this.menuRef.getElementsByClassName(`${cnPrefix}-select-menu-menu-item`);
          if ($menuItemCollection.length) {
            let $selectNode: Element|null = $menuItemCollection[$menuItemCollection.length - 1];
            while($selectNode && hasClass($selectNode, `${cnPrefix}-select-menu-menu-item-disabled`)) {
              $selectNode = $selectNode.previousElementSibling;
            }
            if ($selectNode) {
              addClass($selectNode, `${cnPrefix}-select-menu-menu-item-focus`);
            }
          }
        }
      } else if (e.keyCode === KeyCode.ENTER) {
        const $focusCollection = this.menuRef.getElementsByClassName(`${cnPrefix}-select-menu-menu-item-focus`);
        if ($focusCollection.length) {
          this.onSelectByKey($focusCollection[0].getAttribute('data-key') || '');
        } else {
          this.setState({
            isOpenList: false,
          });
        }
      }
    } else {
      if (e.keyCode === KeyCode.ENTER) {
        this.setState({
          isOpenList: true
        });
      }
    }    
  }

  onClickWrap(e: React.MouseEvent<HTMLDivElement>) {
    if (this.state.isOpenList) {
      this.menuRef.blur();
    } else {
      this.setState({
        isOpenList: true,
      });
    }
  }

  onBlurMenu() {
    this.setState({
      isOpenList: false,
    });
  }

  onSelectByKey(key: string) {
    if (key) {
      const selectObj = this.listMap[key];
      if (selectObj) {
        this.onSelect(selectObj);
        this.setState({
          isOpenList: false,
        });
      }
    }
  }

  onSelect(selectObj: ListDataItem): void {
    const {
      onSelect,
      onBeforeSelected,
      onSelected,
    } = this.props;
    const selectedKey = selectObj.key;
    if (onSelect) {
      onSelect(selectedKey, selectObj);
    }
    if (selectObj && !selectObj.disabled) {
      let isPrevent = false;
      if (typeof onBeforeSelected === 'function') {
        // onBeforeSelected 返回的是isPrevent，如果为true，则阻止onSelected的执行
        isPrevent = Boolean(onBeforeSelected(selectedKey, selectObj));
      }
      if (!isPrevent) {
        this.setState({
          selectedKey,
        }, () => {
          if (onSelected) {
            onSelected(selectedKey, selectObj);
          }
        });
      }
    }
  }

  getMenuNode(node: HTMLDivElement) {
    this.menuRef = node;
  }
  
  render() {
    const {
      tabIndex,
      placeholder,
      menuClassName,
      style,
    } = this.props;
    const {
      selectedKey,
      isOpenList,
    } = this.state;
    return (
      <div
        className={cn(`${cnPrefix}-select-menu-wrap`, menuClassName, {
          [`${cnPrefix}-select-menu-open`]: isOpenList
        })}
        ref={this.getMenuNode}
        tabIndex={tabIndex}
        style={style}
        onClick={this.onClickWrap}
        onBlur={this.onBlurMenu}
        onKeyDown={this.onKeyDownMenu}
      >
        <div
          className={cn(`${cnPrefix}-select-menu-menu-title`, {
            [`${cnPrefix}-select-menu-placeholder`]: !selectedKey
          })}
          
        >
          {
            selectedKey
              ? this.listMap[selectedKey].value
              : (placeholder || '')
          }
        </div>
        <div className={`${cnPrefix}-select-arrow`}>▾</div>
        <Fade show={isOpenList} speed={0.2}>
          <div className={`${cnPrefix}-select-menu-menu-list`}>
            {
              this.listData.map((listItem: ListDataItem) => (
                <div
                  className={cn(`${cnPrefix}-select-menu-menu-item`, {
                    [`${cnPrefix}-select-menu-menu-item-disabled`]: listItem.disabled,
                    [`${cnPrefix}-select-menu-menu-item-selected`]: selectedKey === listItem.key,
                  })}
                  key={listItem.key}
                  onClick={() => {
                    this.onSelect(listItem);
                  }}
                  data-key={listItem.key}
                >
                  { listItem.value }
                </div>
              ))
            }
          </div>
        </Fade>
      </div>
    )
  }
}

export default SelectMenu;
