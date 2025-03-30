# Form Builder System Architecture (Final)

## 1. Introduction & Feature Summary

A flexible form building system enabling:

- Hierarchical form organization (folder-like structure)
- Version-controlled forms and workflows  
- Multi-step approval workflows with conditional branching
- Internationalization support (translatable fields)
- Field-level permissions and access control
- Comprehensive audit logging
- Data export capabilities
- File attachment handling  
- Polymorphic reference fields
- Custom validation framework

**Key Characteristics:**

- Workflow-first design with parallel version support
- Mobile-friendly data collection foundation
- Enterprise-grade auditing and security  
- Scalable to 100k+ form entries
- Multi-organization support

## 2. Complete Model Specifications

### Form Group

**Fields:**
- `title` (string)
- `description` (text)  
- `form_group_id` (nullable FK)
- `creator_id` (FK to Member)

**Associations:**
- `has_many :form_groups`
- `has_many :forms`  
- `belongs_to :parent_form_group` (optional)

**Notes:**
- We can have Dril down view (like windows folders) or Tree view that nodes can be expanded/collapsed.
---
### Form

**Fields:**
- `title` (string)
- `description` (text)  
- `form_group_id` (nullable FK)
- `active` (boolean)
- `has_workflow` (boolean)
- `creator_id` (FK to Member)

**Associations:**
- `has_many :form_versions`
- `belongs_to :form_group` (optional)

---
### Form Version

**Fields:**
- `form_id` (FK)
- `version_number` (integer)  
- `active` (boolean)
- `numbering_rule` (jsonb)
- `creator_id` (FK to Member)

**Associations:**
- `has_many :fields`
- `has_many :workflows`  
- `belongs_to :form`

**notes:**
- when a form is updated if there is a form_entry for the form_version we will deactivate existing form_versaion and add a new active form version

---
### Workflow

**Fields:**
- `title` (string)
- `form_version_id` (FK)  
- `active_version_id` (FK to WorkflowVersion)

**Associations:**
- `has_many :workflow_versions`
- `belongs_to :form_version`

**notes:**
- when a workflow definition is updated if there is a form_entry for the workflow_version we will deactivate existing workflow_versaion and add a new active workflow version

---
### Workflow Version

**Fields:**
- `workflow_id` (FK)
- `version_number` (integer)  
- `active` (boolean)
- `migration_strategy` (enum)
- `creator_id` (FK to Member)

**Associations:**
- `has_many :steps`
- `has_many :step_conditions`  
- `belongs_to :workflow`

---
### Field Type

**Fields:**
- `name` (string, unique) (like short string, long string, integer, float, date, date time, select, multi select, file, and many more)
- `attributes` (jsonb)

**Associations:**
- `has_many :fields`
- `has_many :step_prompts`

---
### Field

**Fields:**
- `form_version_id` (FK)
- `title` (jsonb)
- `description` (jsonb)  
- `field_type_id` (FK)
- `attributes` (jsonb)
- `css` (string)
- `validation_rules` (jsonb)

**Associations:**
- `has_many :validators`
- `belongs_to :form_version`  
- `belongs_to :field_type`

---
### Validator

**Fields:**
- `field_id` (FK)
- `name` (string)
- `parameters` (jsonb)  
- `error_message_key` (string)

**Associations:**
- `belongs_to :field`

---
### Step

**Fields:**
- `workflow_version_id` (FK)
- `title` (string)  
- `order` (integer)
- `step_type` (enum)
- `completion_policy` (enum) (approved by all members in the step, approved by any member in the step, approved by n approval)

**Associations:**
- `has_many :step_accesses`
- `has_many :step_prompts`  
- `has_many :step_deadlines`
- `belongs_to :workflow_version`

**Notes:**
- In every workflow will have a generation step (first step) and a completed step (last step) by default. They should be always first and last steps.
- The names should be still updatable. other steps can only be added and reordered between those 2 steps.
- By default workflow progression is linear based on the step orders, but we can have conditional branching as well.

---
### Step Access

**Fields:**
- `permissionable` (polymorphic)
- `step_id` (FK)  
- `visible_field_ids` (array)
- `editable_field_ids` (array)
- `notify_members` (boolean)
- `for_information` (boolean)

**Associations:**
- `belongs_to :step`

---
### Step Deadline

**Fields:**
- `step_id` (FK)
- `days` (integer)  
- `action` (enum)

**Associations:**
- `belongs_to :step`

---
### Step Prompt

**Fields:**
- `step_access_id` (nullable FK)  
- `title` (jsonb)
- `description` (jsonb)
- `field_type_id` (FK)
- `attributes` (jsonb)
- `required` (boolean)

**Associations:**
- `belongs_to :step_access` (optional)  
- `belongs_to :field_type`
- `has_many :step_prompt_values`

---
### Form Entry

**Fields:**
- `form_number` (string)
- `status` (enum)  {active, completed, canceled, deleted}
- `current_step_id` (FK)
- `workflow_version_id` (FK)

**Associations:**
- `has_many :form_entry_values`
- `has_many :workflow_actions`  
- `has_many :comments`
- `belongs_to :current_step`

**Notes:**
- Canceled means ineffective but still visible (we can highlight them with gray in the list to emphasize it is not effective), deleted means not effective and not visible.  

---
### Form Entry Value

**Fields:**
- `form_entry_id` (FK)
- `field_id` (FK)  
- `value` (jsonb)
- `reference_type` (string)
- `reference_id` (bigint)

**Associations:**
- `belongs_to :form_entry`
- `belongs_to :field`  
- `belongs_to :reference, polymorphic: true`

---
### Form Entry Comment

**Fields:**
- `form_entry_id` (FK)
- `member_id` (FK)  
- `text` (text)
- `mentioned_member_ids` (array)

**Associations:**
- `belongs_to :form_entry`
- `belongs_to :author, class_name: "Member"`

---
### Workflow Action

**Fields:**
- `form_entry_id` (FK)
- `step_access_id` (FK)  
- `member_id` (FK)
- `action_type` (enum)
- `action_time` (datetime)
- `obsolete` (boolean)

**Associations:**
- `has_many :step_prompt_values`
- `belongs_to :form_entry`  
- `belongs_to :step_access`
- `belongs_to :step` (delegate step_access)

**Notes:**
- members can submit a form or send it to a previous step
- if there is a step fields for the step (or step access) user should see a review button instead. then they should answer step fields and then they can submit or send form to a previous step.  
- When someone submits the form_entry, it should check completion policy if it is met, the form goes to the next step and the remaining fom_entry_refs will be obsolete. 
- When someone sends the form_entry back to a previous step, all form_entry_ref that doesn't have an action yet will be obsolete.

---
### Step Prompt Value

**Fields:**
- `step_prompt_id` (FK)
- `workflow_action_id` (FK)  
- `value` (jsonb)

**Associations:**
- `belongs_to :step_prompt`
- `belongs_to :workflow_action`

## 3. Implementation Roadmap

### Phase 1: Core Foundation (4-6 weeks)

1. **Base Models & Versioning**
   - Form/Workflow hierarchy
   - Version snapshots
   - PaperTrail auditing

2. **Workflow Engine**  
   - Linear step progression
   - Basic completion policies  
   - Access control setup

3. **Internationalization**
   - Mobility gem configuration
   - Locale handling
   - Fallback chains

### Phase 2: Advanced Features (6-8 weeks)

1. **Conditional Workflows**
   - Step conditions
   - Branch evaluation  
   - Version migration

2. **Step Prompts System**
   - Access-specific prompts
   - Answer validation  
   - Value storage

3. **Attachment Service**
   - S3 direct upload
   - Virus scanning  
   - Metadata handling

### Phase 3: Optimization (4 weeks)

1. **Performance**
   - Database indexing
   - Query optimization  
   - Caching

2. **Scalability**
   - Background jobs
   - Table partitioning  
   - Load testing
