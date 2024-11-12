interface ParseJsonBodyOptions {
  keys?: string[];
}

const parseJsonBody = (options: ParseJsonBodyOptions = {}) => {
  const keysToParse = options.keys || [];

  return (req: any, res: any, next: any) => {
    Object.keys(req.body).forEach((key: string) => {
      if (keysToParse.includes(key) && typeof req.body[key] === 'string') {
        try {
          req.body[key] = JSON.parse(req.body[key]);
        } catch (err) {
          throw new Error('Invalid JSON');
        }
      }
    });
    next();
  };
};

export default parseJsonBody;
