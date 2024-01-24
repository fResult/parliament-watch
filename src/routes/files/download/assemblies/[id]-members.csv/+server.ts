import { createCsvFileResponse } from '$lib/csv';
import { fetchAssemblies, fetchFromIdOr404, fetchPoliticians } from '$lib/datasheets';
import { getAssemblyMembers } from '$lib/datasheets/assembly-member';

export const prerender = true;

export async function GET({ params }) {
	const assembly = await fetchFromIdOr404(fetchAssemblies, params.id);
	const members = getAssemblyMembers(assembly, await fetchPoliticians());

	return createCsvFileResponse(
		members.map(
			({ prefix, firstname, lastname, sex, birthdate, educations, assemblyRole, partyRole }) => ({
				prefix,
				firstname,
				lastname,
				sex,
				birthdate,
				educations: educations.join(','),
				role: assemblyRole?.role,
				appointmentMethod: assemblyRole?.appointmentMethod,
				party: partyRole?.party.name,
				province: assemblyRole?.province,
				districtNumber: assemblyRole?.districtNumber,
				listNumber: assemblyRole?.listNumber,
				startedAt: assemblyRole?.startedAt,
				endedAt: assemblyRole?.endedAt
			})
		)
	);
}
