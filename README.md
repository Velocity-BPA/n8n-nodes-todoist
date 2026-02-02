# n8n-nodes-todoist

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

## License

Licensed under the Business Source License 1.1 (BSL 1.1). You may not use this file except in compliance with the License. You may obtain a copy of the License at:

https://mariadb.com/bsl11/

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

This is an n8n community node for integrating with Todoist's task management API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

### Community Nodes (Recommended)

For users on n8n v0.187+, your instance owner can install this node from [Community Nodes](https://docs.n8n.io/integrations/community-nodes/installation/).

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-todoist` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n runs it within your workflow environment.

### Manual installation

To get started install the package in your n8n root directory:

`npm install n8n-nodes-todoist`

For Docker-based deployments, add the following line before the font installation command in your [n8n custom docker file](https://docs.n8n.io/hosting/installation/docker/#creating-custom-docker-builds):

`RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-todoist`

## Operations

### Task
- **Create**: Create a new task
- **Complete**: Mark a task as completed
- **Get Many**: Retrieve multiple tasks

### Project
- **Create**: Create a new project

## Credentials

This node requires Todoist API credentials. You can obtain your API token from your Todoist settings:

1. Go to Todoist Settings
2. Navigate to Integrations
3. Copy your API token
4. Add it to your n8n Todoist API credentials

## Compatibility

Tested against n8n v1.0+.

## Usage

### Creating a Task

1. Select "Task" as the resource
2. Choose "Create" operation
3. Enter the task content
4. Optionally set description and priority

### Completing a Task

1. Select "Task" as the resource
2. Choose "Complete" operation
3. Enter the task ID

### Listing Tasks

1. Select "Task" as the resource
2. Choose "Get Many" operation
3. Optionally filter by project ID

### Creating a Project

1. Select "Project" as the resource
2. Choose "Create" operation
3. Enter the project name

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Todoist REST API documentation](https://developer.todoist.com/rest/v2/)

## Version history

- 1.0.0: Initial release with basic task and project operations

## Contributing

Contributions are welcome! Please ensure all contributions comply with the BSL 1.1 license terms.