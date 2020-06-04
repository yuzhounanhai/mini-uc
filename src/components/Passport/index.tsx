import * as React from 'react';

export interface SafelyPassportProps {
  mode?: '|' | '&';
  role?: string;
  allowRole?: string;
  allowMinRole?: string;
  allRoles?: string[] | {
    [roleName: string]: number,
  };
  condition?: any;
  [customKey: string]: any;
}

export interface PassportProps extends SafelyPassportProps {
  onAuthCheck?: (props: SafelyPassportProps) => boolean;
  noPassContent?: React.ReactNode;
  children?: React.ReactNode;
};

function Passport(props: PassportProps) {
  const {
    mode = '&',
    role,
    allowRole,
    allowMinRole,
    allRoles,
    condition,
  } = props;
  const {
    children,
    onAuthCheck,
    noPassContent,
    ...safelyOtherProps
  } = props;
  if (mode !== '&' && mode !== '|') {
    throw Error(`The value of props 'mode' invalid, only '&' and '|' is valid.`);
  }
  let isRolePass = false;
  let isConditionPass = false;
  let isAuthPass = false;

  // 没有设置role 则忽略这一项验证
  if (role === undefined && allowRole === undefined && allowMinRole === undefined && mode === '&') {
    isRolePass = true;
  } else if (role && allowMinRole && allRoles) {
    if (Array.isArray(allRoles)) {
      isRolePass = (allRoles.indexOf(role) >= allRoles.indexOf(allowMinRole));
    } else if (typeof allRoles === 'object') {
      isRolePass = (allRoles[role] >= allRoles[allowMinRole]);
    }
  } else if (role && allowRole) {
    isRolePass = (role === allowRole);
  }

  if (condition === undefined && mode === '&') {
    isConditionPass = true;
  } else {
    isConditionPass = !!condition;
  }

  if (onAuthCheck === undefined && mode === '&') {
    isAuthPass = true;
  } else if (typeof onAuthCheck === 'function') {
    isAuthPass = onAuthCheck(safelyOtherProps);
  }

  let isPass = false;
  if (mode === '&') {
    isPass = isAuthPass && isConditionPass && isRolePass;
  }
  if (mode === '|') {
    isPass = isAuthPass || isConditionPass || isRolePass;
  }

  if (isPass) {
    return children;
  } else {
    return noPassContent;
  }
}

export default Passport;
