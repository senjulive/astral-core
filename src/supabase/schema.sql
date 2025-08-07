
-- Enable the pgcrypto extension for UUID generation
create extension if not exists "p"."gcrypto" with schema "extensions";

-- Custom Types
create type "public"."chat_sender" as enum ('user', 'admin');
create type "public"."promotion_status" as enum ('Upcoming', 'Active', 'Expired');

-- Tables
create table "public"."profiles" (
    "user_id" "uuid" not null,
    "created_at" timestamp with time zone not null default "now"(),
    "username" "text" not null,
    "full_name" "text",
    "avatar_url" "text",
    "contact_number" "text",
    "country" "text",
    "referral_code" "text",
    "squad_leader_id" "uuid",
    "id_card_no" text,
    "address" text,
    "date_of_birth" date,
    "id_card_front_url" text,
    "id_card_back_url" text
);
alter table "public"."profiles" enable row level security;
alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index ("username");

create table "public"."wallets" (
    "id" "uuid" not null default "gen_random_uuid"(),
    "user_id" "uuid" not null,
    "created_at" timestamp with time zone not null default "now"(),
    "balances" "jsonb" not null default '{"usdt": 0, "btc": 0, "eth": 0}'::"jsonb",
    "addresses" "jsonb" not null default '{"usdt": ""}'::"jsonb",
    "security" "jsonb" not null default '{}'::"jsonb",
    "growth" "jsonb" not null default '{"clicks_left": 4, "last_reset": "2023-01-01T00:00:00Z", "daily_earnings": 0, "earnings_history": []}'::"jsonb",
    "verification_status" "text" not null default 'unverified'::"text",
    "pending_withdrawals" "jsonb"[] not null default '{}'::"jsonb"[]
);
alter table "public"."wallets" enable row level security;

create table "public"."messages" (
    "id" "uuid" not null default "gen_random_uuid"(),
    "user_id" "uuid" not null,
    "created_at" timestamp with time zone not null default "now"(),
    "timestamp" timestamp with time zone not null default "now"(),
    "sender" "public"."chat_sender" not null,
    "text" "text" not null,
    "silent" boolean not null default false,
    "file_url" "text"
);
alter table "public"."messages" enable row level security;

create table "public"."notifications" (
    "id" "uuid" not null default "gen_random_uuid"(),
    "user_id" "uuid" not null,
    "created_at" timestamp with time zone not null default "now"(),
    "title" "text" not null,
    "content" "text" not null,
    "read" boolean not null default false,
    "href" "text"
);
alter table "public"."notifications" enable row level security;

create table "public"."settings" (
    "key" "text" not null,
    "value" "jsonb",
    "created_at" timestamp with time zone not null default "now"()
);
alter table "public"."settings" enable row level security;

create table "public"."promotions" (
    "id" "uuid" not null default "gen_random_uuid"(),
    "created_at" timestamp with time zone not null default "now"(),
    "title" "text" not null,
    "description" "text" not null,
    "image_url" "text",
    "status" "public"."promotion_status" not null
);
alter table "public"."promotions" enable row level security;

create table "public"."support_threads" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "handler_id" uuid
);
alter table "public"."support_threads" enable row level security;

create table "public"."action_logs" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "action" text not null,
    "metadata" jsonb
);
alter table "public"."action_logs" enable row level security;


-- Primary Keys
alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index ("user_id");
alter table "public"."wallets" add constraint "wallets_pkey" PRIMARY KEY using index ("id");
alter table "public"."messages" add constraint "chat_messages_pkey" PRIMARY KEY using index ("id");
alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index ("id");
alter table "public"."settings" add constraint "settings_pkey" PRIMARY KEY using index ("key");
alter table "public"."promotions" add constraint "promotions_pkey" PRIMARY KEY using index ("id");
alter table "public"."support_threads" add constraint "support_threads_pkey" PRIMARY KEY using index ("user_id");
alter table "public"."action_logs" add constraint "action_logs_pkey" PRIMARY KEY using index ("id");

-- Foreign Keys
alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
alter table "public"."profiles" add constraint "profiles_squad_leader_id_fkey" FOREIGN KEY (squad_leader_id) REFERENCES auth.users(id) on delete set null;
alter table "public"."wallets" add constraint "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
alter table "public"."messages" add constraint "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
alter table "public"."support_threads" add constraint "support_threads_handler_id_fkey" FOREIGN KEY (handler_id) REFERENCES auth.users(id) on delete set null;
alter table "public"."support_threads" add constraint "support_threads_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) on delete cascade;
alter table "public"."action_logs" add constraint "action_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) on delete cascade;

-- Indexes
create index "idx_messages_user_id" on public.messages using btree (user_id);

-- Function to generate a random referral code
create or replace function "public"."generate_referral_code"()
returns "text" as $$
declare
  "chars" "text"[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}';
  "result" "text" := '';
  "i" "integer" := 0;
begin
  for "i" in 1..8 loop
    "result" := "result" || "chars"[1+floor(random()*(array_length("chars", 1)-1))];
  end loop;
  return "result";
end;
$$ language "plpgsql" volatile;

-- Function to handle new user setup
create or replace function "public"."handle_new_user"()
returns "trigger" as $$
declare
  "squad_leader_uuid" "uuid";
begin
  -- Create Profile
  insert into "public"."profiles" ("user_id", "username", "contact_number", "country", "referral_code", "squad_leader_id")
  values (
    "new"."id",
    "new"."raw_user_meta_data"->>'username',
    "new"."raw_user_meta_data"->>'contact_number',
    "new"."raw_user_meta_data"->>'country',
    "public"."generate_referral_code"(),
    null -- We will update this later if a referral code was used
  );

  -- Create Wallet
  insert into "public"."wallets" ("user_id")
  values ("new"."id");

  -- Handle referral code if it exists
  if "new"."raw_user_meta_data"->>'referral_code' is not null then
    select "user_id" into "squad_leader_uuid" from "public"."profiles"
    where "referral_code" = "new"."raw_user_meta_data"->>'referral_code'
    limit 1;
    
    if "squad_leader_uuid" is not null then
      update "public"."profiles"
      set "squad_leader_id" = "squad_leader_uuid"
      where "user_id" = "new"."id";
    end if;
  end if;

  return "new";
end;
$$ language "plpgsql" security definer;

-- Trigger to call the function on new user creation
create trigger "on_auth_user_created"
after insert on "auth"."users"
for each row execute procedure "public"."handle_new_user"();


-- Function to allow admin to manually trigger user setup
create or replace function "public"."handle_new_user_by_id"("user_id_param" "uuid")
returns "void" as $$
begin
  if not exists (select 1 from public.profiles where user_id = user_id_param) then
    insert into "public"."profiles" ("user_id", "username", "contact_number", "country", "referral_code")
    select
      "id",
      "raw_user_meta_data"->>'username',
      "raw_user_meta_data"->>'contact_number',
      "raw_user_meta_data"->>'country',
      "public"."generate_referral_code"()
    from "auth"."users" where "id" = "user_id_param";
  end if;

  if not exists (select 1 from public.wallets where user_id = user_id_param) then
    insert into "public"."wallets" ("user_id")
    values ("user_id_param");
  end if;
end;
$$ language "plpgsql" security definer;
