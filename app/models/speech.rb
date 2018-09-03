require 'google/cloud/translate'
require 'pry-byebug'
class Speech
  def initialize(params = {})
    @speech = Google::Cloud::Speech.new
    @credentials = params[:creds]
    keyfile = ENV["TRANSLATION_CREDENTIALS"]
    creds = Google::Cloud::Translate::Credentials.new(keyfile)


    @translate = Google::Cloud::Translate.new(
      project_id: ENV["PROJECT_ID"],
      credentials: creds
      )

    @streaming_config =
      { config:
        {
          encoding: :LINEAR16,
          sample_rate_hertz: 16000,
          language_code: params[:language]
        },
        interim_results: true
      }

      @host_lang = params[:host_lang] || "en"
      @recieve_lang = params[:recieve_lang] || "en"

      @stream = @speech.streaming_recognize(@streaming_config)
      @audio = ""
  end


  def write_to_stream(audio)
      @stream.send(audio.split(",").map { |str| str.to_i }.pack("s<*"))
  end

  def stream
    while true
      break if @stream.stopped?
      results = @stream.results

      unless results.first.nil?
        alt = results.first.alternatives
        alt.each do |result|
          puts "Original: #{result.transcript}"
          puts "Translated: #{translate(result.transcript)}"
        end
        break
      end
    end

    @stream.stop
    @stream.wait_until_complete!
  end

  def translate(text)
    trans = @translate.translate(text, from: @host_lang, to: @recieve_lang)
    translation.text.gsub("&#39;", "'")
  end
end
