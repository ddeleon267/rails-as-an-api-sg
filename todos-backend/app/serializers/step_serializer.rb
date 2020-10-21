class StepSerializer < ActiveModel::Serializer
  attributes :id, :description

  belongs_to :todo
end
