"""Added other user token columns

Revision ID: 5a68b15292d7
Revises: 80b96df90965
Create Date: 2023-04-19 18:56:01.362072

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5a68b15292d7'
down_revision = '80b96df90965'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_token', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('plaid_id', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('plaid_id')
        batch_op.drop_column('user_token')

    # ### end Alembic commands ###