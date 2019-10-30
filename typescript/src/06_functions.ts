const logger = (message: string): void => {
    console.log(message);
};

const throwError = (message: string): never => {
    throw  new Error(message);
};

