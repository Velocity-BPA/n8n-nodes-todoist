/*
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://mariadb.com/bsl11/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

export class Todoist implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Todoist',
		name: 'todoist',
		icon: 'file:todoist.svg',
		group: ['productivity'],
		version: 1,
		description: 'Interact with Todoist API for task management',
		defaults: {
			name: 'Todoist',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'todoistApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Project',
						value: 'project',
					},
				],
				default: 'task',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['task'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new task',
						action: 'Create a task',
					},
					{
						name: 'Complete',
						value: 'complete',
						description: 'Complete a task',
						action: 'Complete a task',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many tasks',
						action: 'Get many tasks',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new project',
						action: 'Create a project',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Task content',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Task description',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Priority 1',
						value: 4,
					},
					{
						name: 'Priority 2',
						value: 3,
					},
					{
						name: 'Priority 3',
						value: 2,
					},
					{
						name: 'Priority 4',
						value: 1,
					},
				],
				default: 1,
				description: 'Task priority',
			},
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['complete'],
					},
				},
				default: '',
				description: 'ID of the task to complete',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['getMany'],
					},
				},
				default: '',
				description: 'Project ID to filter tasks',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Project name',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i);
			const operation = this.getNodeParameter('operation', i);

			const credentials = await this.getCredentials('todoistApi');
			const apiToken = credentials.apiToken as string;

			const options = {
				headers: {
					'Authorization': `Bearer ${apiToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			};

			try {
				let responseData;

				if (resource === 'task') {
					if (operation === 'create') {
						const content = this.getNodeParameter('content', i) as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const priority = this.getNodeParameter('priority', i, 1) as number;

						const body: any = {
							content,
							priority,
						};

						if (description) {
							body.description = description;
						}

						responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: 'https://api.todoist.com/rest/v2/tasks',
							body,
							...options,
						});
					} else if (operation === 'complete') {
						const taskId = this.getNodeParameter('taskId', i) as string;

						responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: `https://api.todoist.com/rest/v2/tasks/${taskId}/close`,
							...options,
						});
					} else if (operation === 'getMany') {
						const projectId = this.getNodeParameter('projectId', i, '') as string;
						let url = 'https://api.todoist.com/rest/v2/tasks';

						if (projectId) {
							url += `?project_id=${projectId}`;
						}

						responseData = await this.helpers.httpRequest({
							method: 'GET',
							url,
							...options,
						});
					}
				} else if (resource === 'project') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;

						const body = {
							name,
						};

						responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: 'https://api.todoist.com/rest/v2/projects',
							body,
							...options,
						});
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map(item => ({ json: item })));
				} else {
					returnData.push({ json: responseData || {} });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error);
			}
		}

		return [returnData];
	}
}