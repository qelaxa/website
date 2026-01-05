-- Allow Admins to view ALL profiles
create policy "Admins can view all profiles." on public.profiles 
for select using (
  exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
);

-- (Optional) If you get "policy exists" error, that's fine, it means it was already there.
