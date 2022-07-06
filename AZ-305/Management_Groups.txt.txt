Design management groups with governance in mind. For example, apply Azure policies at the management group level for all workloads that require the same security, compliance, connectivity, and feature settings.

Keep the management group hierarchy reasonably flat. Ideally have no more than three or four levels. A hierarchy that is too flat doesn’t provide flexibility and complexity for large organizations. A hierarchy with too many levels will be difficult to manage.

Consider a top-level management group. This management group supports common platform policy and Azure role assignments across the whole organization. For example, the Tailwinds management group is a top-level management group for all organizational-wide policies.

Consider an organizational or departmental structure. An organizational structure will be easy to understand. For example, the Sales, Corporate, and IT management groups.

Consider a geographical structure. A geographical structure allows for compliance policies in different regions. For example, the West and East management groups in Sales.

Consider a production management group. A production management group creates policies that apply to all corporate products. In our example, the Production management group provides product-specific policies for corporate apps.

Consider a sandbox management group. A sandbox management group lets users experiment with Azure. The sandbox provides isolation from your development, test, and production environments. Users can experiment with resources that might not yet be allowed in production environments.

Consider isolating sensitive information in a separate management group. In our example, the Corporate management group provides more standard and compliance policies for the main office.

