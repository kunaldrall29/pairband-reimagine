import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-LLcWCD5e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Dm7hmQ9Z.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getEventBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("7501ebcf429b39d58ffefb6db255bdaac4f1684b97b81d13f37d919b9ed3847f"));
var listLiveListings = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(createSsrRpc("465c350b33078be447c5366ab16a99d24917f21af526b6ac46fac2cd4eef3393"));
var getListing = createServerFn({ method: "GET" }).validator((id) => id).handler(createSsrRpc("89673ddce95df0be49684a1688f8929f79631d651591b99d22af9b46bd9326cb"));
var getDeal = createServerFn({ method: "GET" }).validator((id) => id).handler(createSsrRpc("4ef1c18d9099f82c81fc1e2207136dc138d95f9491d11905a5532d1008e82bf5"));
var getDraftByToken = createServerFn({ method: "GET" }).validator((token) => token).handler(createSsrRpc("efb48d9fc1175efce2434389c7632da2683fc6569c239f65fad4afdd3ec46353"));
var importTweetDraft = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("fecb348d89fbab0881943ffd816c5400a80945faefb85e80703e6373978fa2ac"));
var upsertMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f6f93d910e14a7e38629d35f0f1ad348f0144f65a4db4ddc57e0dcbbdf10ce90"));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3ad432dc08314943d3188e54b66b307793874164d6701ad294837336a237ae2c"));
var publishDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d016da9fc60536609d474ec0b73a7dc69b72cfa19d643ee5dec065a6bea6fd8b"));
var createDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1a7ba4a6aff79d8efc6437f6077ed7903d35d60aa388f6dbfdeff0033afc6346"));
var lockDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("de6b5504bd65a4d28364b44dddda2ffb013cafc57b37843ec2105b865839d477"));
var submitProof = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("119776eed05733bb9d7dc58f9c0131197386288290a98c7e2769022ce9169063"));
var runAiProofReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("cdc8e29921d6b7f5dab2d10117710059af0b44f533fe1d58a6d8c433c17ba0d5"));
var challengeDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f1d9340e4cd8e6f77b84d989a39936c69c419c92c558fdbc3f2b337d769fea97"));
var releaseDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c29dad3b47aabe42153433921f9b3cb84035641344481027ea01e6ad60c8b2af"));
var refundDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b6a6908e7b6ec9c56e74bcc26c8cf55fec395f5e4dfbaa70250ffa02b7535310"));
var getMyDeals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("167bd746fe7234af5c28187e16ddb57a384087eaec4e48532ea17f035b96b0a0"));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("142b8cef83a75e14feeb6e12148ecdc00e65a321cae9fa3bfdbea98bb1ecdbc6"));
//#endregion
export { submitProof as _, getDraftByToken as a, getMyDeals as c, listLiveListings as d, lockDeal as f, runAiProofReport as g, releaseDeal as h, getDeal as i, getMyProfile as l, refundDeal as m, challengeDeal as n, getEventBySlug as o, publishDraft as p, createDeal as r, getListing as s, adminOverview as t, importTweetDraft as u, upsertMyProfile as v };
