import { z } from 'zod';
import type { Link } from './link';

export const votingSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		officialTitle: z.string().default('รอชื่ออย่างเป็นทางการ'),
		date: z.date(),
		description: z.string().optional(),
		representativeAssemblyId: z.string().optional(),
		senateAssemblyId: z.string().optional(),
		result: z.string().default('รอตรวจสอบ'),
		categories: z.string().optional(),
		documents: z.string(),
		sourceUrl: z.string()
	})
	.transform(({ categories, representativeAssemblyId, senateAssemblyId, documents, ...voting }) => {
		const participatedAssembleIds = [representativeAssemblyId, senateAssemblyId].filter(
			(id) => !!id
		) as string[];

		return {
			...voting,
			categories: categories?.split(',') || [],
			meetingType:
				representativeAssemblyId && senateAssemblyId
					? 'ประชุมร่วมกันของรัฐสภา'
					: representativeAssemblyId
					? 'ประชุมสภาผู้แทนราษฎร'
					: 'ประชุมวุฒิสภา',
			participatedAssembleIds,
			// TODO: Only support default vote option for now
			voteOptions: [
				DefaultVoteOption.Agreed,
				DefaultVoteOption.Disagreed,
				DefaultVoteOption.Novote,
				DefaultVoteOption.Abstain,
				DefaultVoteOption.Absent
			] as (DefaultVoteOption | CustomVoteOption | string)[],
			winningCondition: 'รออัพเดต winningCondition',
			files: documents.split('\n').map<Link>((line) => {
				const [label, url] = line.split(',').map((value) => value.trim());
				return { label, url };
			}),
			highlightedVoteByGroups: []
		};
	});

export type Voting = z.infer<typeof votingSchema>;

export interface CustomVoteOption {
	label: string;
	colorIntensity: number; // 0-1
}

export enum DefaultVotingResult {
	Passed = 'ผ่าน',
	Failed = 'ไม่ผ่าน'
}

export enum DefaultVoteOption {
	Agreed = 'เห็นด้วย',
	Disagreed = 'ไม่เห็นด้วย',
	Novote = 'งดออกเสียง',
	Abstain = 'ไม่ลงคะแนน',
	Absent = 'ลา/ขาดลงมติ'
}
