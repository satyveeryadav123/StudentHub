-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('approved-resources', 'approved-resources', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'resources' AND auth.uid() IS NOT NULL
);
CREATE POLICY "Users can view own uploads" ON storage.objects FOR SELECT USING (
  bucket_id = 'resources' AND (storage.foldername(name))[1] = auth.uid()::text
);
CREATE POLICY "Anyone can view approved resources" ON storage.objects FOR SELECT USING (
  bucket_id = 'approved-resources'
);
CREATE POLICY "Admins can move files" ON storage.objects FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
