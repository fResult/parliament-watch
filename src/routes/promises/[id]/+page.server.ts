import { fetchFromIdOr404, fetchPromises } from '$lib/datasheets/index.js';

export async function load({ params }) {
	const promise = await fetchFromIdOr404(fetchPromises, params.id);

	return {
		promise
	};
}