/**
 * 私人访问权限与隐私防护辅助模块
 * 确保未经授权的用户无法查看标记为私密的照片、日记与回忆
 */

const ACCESS_PASSCODE_KEY = "our_little_world_passcode_auth";

/**
 * 校验用户输入的密码是否正确
 */
export function verifyPasscode(inputCode: string): boolean {
  const correctPasscode = process.env.NEXT_PUBLIC_SITE_PASSCODE || "love2024";
  return inputCode.trim() === correctPasscode.trim();
}

/**
 * 获取客户端存储的授权状态
 */
export function checkClientAuth(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ACCESS_PASSCODE_KEY) === "true";
}

/**
 * 设置客户端授权状态
 */
export function setClientAuth(granted: boolean): void {
  if (typeof window === "undefined") return;
  if (granted) {
    localStorage.setItem(ACCESS_PASSCODE_KEY, "true");
  } else {
    localStorage.removeItem(ACCESS_PASSCODE_KEY);
  }
}
