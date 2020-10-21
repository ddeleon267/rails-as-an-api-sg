class TodoSerializer < ActiveModel::Serializer
  attributes :id, :description, :completed

  has_many :steps
end
