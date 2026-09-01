import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('os dados precisam estar definidas no .env');
    }
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  async uploadArquivo(
    bucket: string,
    path: string,
    buffer: Buffer,
    contentType: string,
  ) {
    const { error } = await this.client.storage
      .from(bucket)
      .upload(path, buffer, { contentType, upsert: true });

    if (error) {
      console.error('Erro no upload Supabase:', error); // log completo pra debug
      throw new InternalServerErrorException(
        `Erro ao enviar imagem: ${error.message}`,
      );
    }

    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async removerArquivo(bucket: string, path: string) {
    return this.client.storage.from(bucket).remove([path]);
  }
}