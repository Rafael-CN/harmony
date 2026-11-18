using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace Harmony.Services.Photos
{
    public class PhotoService : IPhotoService
    {
        private readonly ILogger<PhotoService> _logger;
        private readonly Cloudinary _cloudinary;

        public PhotoService(IConfiguration configuration, ILogger<PhotoService> logger)
        {
            var account = new Account(
                configuration["CloudinarySettings:Cloudname"],
                configuration["CloudinarySettings:ApiKey"],
                configuration["CloudinarySettings:ApiSecret"]
            );

            _cloudinary = new Cloudinary(account);
            _logger = logger;
        }

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();
            if (file.Length <= 0) return uploadResult;

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
            };

            uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                _logger.LogInformation("Houve um erro ao salvar a foto: {Error}", uploadResult.Error.Message);
            }

            return uploadResult;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var deletionResult = await _cloudinary.DestroyAsync(deleteParams);

            if (deletionResult.Error != null)
            {
                _logger.LogInformation("Houve um erro ao deletar a foto: {Error}", deletionResult.Error.Message);
            }

            return deletionResult;
        }
    }
}
