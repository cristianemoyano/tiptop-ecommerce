const isStoreEnabled = () => {
    return Boolean(Number(process.env.NEXT_PUBLIC_SHOPPING_IS_ENABLED))
}

export default isStoreEnabled;
