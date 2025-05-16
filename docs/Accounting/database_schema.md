# Accounting settings 
It is a set of configs that should be set before using a the accounting system. We need to add 2 fields in the organizations table:

1- uses_accounting: a boolan field that can be accessed only by GO3_ADMINs.
2- accounting_settings: is a jsonb field that contains all the configs needed for using the system. if it is null we should redirect users to the accounting settings page and ask them to fill the required values. 

It can be a setup wizard page instead of accounting settings page to allow them complete multiple steps 1 by 1.

accounting settings keys: 
1- base_currency: We should offer the closes guess based on the IP, region, or timezone of the user in the browser. 
2- decimal_numbers: By default 2. they can change it. 
3- category_indicator_length: 1 by default (between 1 and 2)
4- ledger_indicator_length: 2 by default (between 1 and 3)
5- account_indicator_length: 2 by default (between 1 and 4)
6- multi_currency: boolean (default: false)
7- Max_centers: 3 by default (between 1 and 6)
8- center_code_lengrh: 6 by default
9- use_parent_org_accounts: boolean // if has a parent_org
10- use_parent_org_centers: boolean // if has a parent_org
10- use_parent_org_fiscal_years: boolean // if has a parent_org

# account_categories
- id (pk)
- code: string
- name: translatable
- type: enum (balance_sheet, income_statement, temp)
- organization_id: fk

# ledgers
- id (pk)
- code: string
- name: translatable
- account_category_id (fk)
- balance_type: enum (debit/credit)
- is_contra_account: boolean
- contra_account_for (fk, self referenced)
- unexpected_balance: enum (accept, warn, disallow)

# accounts
- id (pk)
- code: string
- name: translatable
- ledger_id: (fk)
- accepts_currency: boolean 
- is_monetary: boolean

# center_types
- id (pk)
- name: translatable
- start_code: string (but accepts only numbers like 00001)
- end_code: string (but accepts only numbers like 00001)
- auto_increment: boolean
- controlled: boolean
- organization_id: fk

# centers
- id (pk)
- code:
- name: translatable
- center_type_id: (fk)

# fiscal_year
- id
- name: translatable
- start_date: date
- end_date: date
- organization_id: fk

# currencies
- id
- name: translatable
- abr: string
- decimal_digits: int
- organization_id: fk

# scenarios
- id
- name: translation
- description: translation
- deadline: date
- cluster: bigint
- is_default: true
- state: enum (tbd, effective, discarded)
- organization_id: fk

# Journal
- id (pk)
- date: date
- effective_date: fk
- fiscal_year_id: fk
- no: int 
- ref: int 
- daily_no: 
- state: enum (draft, posted, approved, finalized)
- journal_type: (beginning, normal, ending)
- description: translatable
- debit: float
- credit: float
- organization_id: fk
- scenario_id: fk
- issuer_id: fk

# journal_entry
- id (pk)
- account_id (fk)
- center1 (fk)
- center2 (fk)
- center3 (fk)
- center4 (fk)
- center5 (fk)
- center6 (fk)
- description: translatable
- debit: float
- credit: float
- currency_id (fk)
- currency_amount: float
- rate: float
