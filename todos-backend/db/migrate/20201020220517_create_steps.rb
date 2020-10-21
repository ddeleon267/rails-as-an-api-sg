class CreateSteps < ActiveRecord::Migration[6.0]
  def change
    create_table :steps do |t|
      t.string :description
      t.integer :todo_id

      t.timestamps
    end
  end
end
