type ResolveFunc<T> = (value?: T) => void;
type RejectFunc = (reason?: any) => void;
const mockPromiseOnce = <T extends any = any>(fn: jest.Mock<Promise<T>>) => {
  let payload = ([] as unknown) as [ResolveFunc<T>, RejectFunc];
  fn.mockReturnValueOnce(new Promise<T>((...args) => (payload = args)));
  return payload;
};

export default mockPromiseOnce;
