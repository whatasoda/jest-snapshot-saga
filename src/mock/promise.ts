type ResolveFunc<T> = (value?: T) => void;
type RejectFunc = (reason?: any) => void;
const mockReturnPromise = <T extends any = any>(fn: jest.Mock<Promise<T>>) => {
  let payload = ([] as unknown) as [ResolveFunc<T>, RejectFunc];
  const promise = new Promise<T>((...args) => (payload = args));
  fn.mockReturnValue(promise);
  return payload;
};

export default mockReturnPromise;
