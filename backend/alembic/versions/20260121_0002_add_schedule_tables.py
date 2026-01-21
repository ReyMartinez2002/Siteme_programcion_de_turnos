"""Add schedule and brand tables, extend riders

Revision ID: 002
Revises: 001
Create Date: 2026-01-21 00:02:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("riders") as batch_op:
        batch_op.add_column(sa.Column("identification", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("store_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("observation", sa.String(), nullable=True))
        batch_op.create_foreign_key(
            "fk_riders_store_id", "panpaya_stores", ["store_id"], ["id"]
        )

    op.create_table(
        "external_brands",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index(
        op.f("ix_external_brands_id"), "external_brands", ["id"], unique=False
    )

    op.create_table(
        "schedule_assignments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("rider_id", sa.Integer(), nullable=False),
        sa.Column("store_id", sa.Integer(), nullable=True),
        sa.Column("external_brand_id", sa.Integer(), nullable=True),
        sa.Column("shift_date", sa.Date(), nullable=False),
        sa.Column("shift_type", sa.String(), nullable=False),
        sa.Column("start_time", sa.String(), nullable=True),
        sa.Column("end_time", sa.String(), nullable=True),
        sa.Column("manual_override", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("notes", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.ForeignKeyConstraint(["rider_id"], ["riders.id"]),
        sa.ForeignKeyConstraint(["store_id"], ["panpaya_stores.id"]),
        sa.ForeignKeyConstraint(["external_brand_id"], ["external_brands.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_schedule_assignments_id"), "schedule_assignments", ["id"], unique=False
    )
    op.create_index(
        "ix_schedule_assignments_shift_date",
        "schedule_assignments",
        ["shift_date"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_schedule_assignments_shift_date", table_name="schedule_assignments")
    op.drop_index(op.f("ix_schedule_assignments_id"), table_name="schedule_assignments")
    op.drop_table("schedule_assignments")

    op.drop_index(op.f("ix_external_brands_id"), table_name="external_brands")
    op.drop_table("external_brands")

    with op.batch_alter_table("riders") as batch_op:
        batch_op.drop_constraint("fk_riders_store_id", type_="foreignkey")
        batch_op.drop_column("observation")
        batch_op.drop_column("store_id")
        batch_op.drop_column("identification")
