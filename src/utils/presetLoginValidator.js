export function validatePresetLogin(account, password, presetAccount) {
  if (!presetAccount) {
    return false;
  }

  const accountMatched = account === presetAccount.phoneNumber || account === presetAccount.email;
  const passwordMatched = password === presetAccount.password;

  return accountMatched && passwordMatched;
}

export function buildPresetLoginHint(presetAccount) {
  if (!presetAccount) {
    return "账号或密码错误";
  }

  return `账号或密码错误！\n预设账号：${presetAccount.phoneNumber}\n预设密码：${presetAccount.password}`;
}