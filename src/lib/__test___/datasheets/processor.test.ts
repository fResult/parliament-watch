import { joinMany, parseMarkdownListToArrayOfItems, safeFind } from '../../datasheets/processor';
import { describe, expect, it } from 'vitest';

describe('parseMarkdownListToArrayOfItems', () => {
	it('should split text with markdown list format to array of item', () => {
		const input = '-  a\n-  b \n-c\n - d - e\n';

		const output = parseMarkdownListToArrayOfItems(input);

		expect(output).toEqual(['a', 'b', 'c', 'd - e']);
	});
});

describe('safeFind', () => {
	const list = ['a', 'b', 'c'];

	it('should return coresponded item if it is found in the list', () => {
		const expectedValue = 'b';

		expect(safeFind(list, (i) => i === expectedValue)).toBe(expectedValue);
	});

	it('should throw an error if item is not found in the list', () => {
		expect(() => safeFind(list, (i) => i === 'e')).toThrow();
	});
});

describe('joinMany', () => {
	it('should return matched item without the join key', () => {
		const list = [
			{ key: 'a', value: 1 },
			{ key: 'a', value: 2 },
			{ key: 'b', value: 3 },
			{ key: 'b', value: 4 }
		];

		expect(joinMany(list, 'key', 'a')).toEqual([{ value: 1 }, { value: 2 }]);
	});
});
