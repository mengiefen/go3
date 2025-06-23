class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  def self.model_translation_scope(scope_key = nil)
    @model_translation_scope = scope_key if scope_key
    @model_translation_scope || "models.#{model_name.i18n_key}"
  end

  def self.model_t(key, **options)
    I18n.t("#{model_translation_scope}.#{key}", **options)
  end

  def model_t(key, **options)
    self.class.model_t(key, **options)
  end
end
